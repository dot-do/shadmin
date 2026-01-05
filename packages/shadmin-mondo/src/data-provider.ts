import type {
  DataProvider,
  MondoDataProviderOptions,
  RaRecord,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteParams,
  DeleteResult,
  DeleteManyParams,
  DeleteManyResult,
  MongoDocument,
  FilterPayload,
} from './types'

/**
 * Normalizes a MongoDB _id to a plain id string
 */
function normalizeId(mongoId: string | { $oid: string }): string {
  if (typeof mongoId === 'object' && '$oid' in mongoId) {
    return mongoId.$oid
  }
  return mongoId
}

/**
 * Converts a MongoDB document to a React Admin record
 * - Normalizes _id to id
 * - Removes _id from the output
 */
function documentToRecord<T extends RaRecord>(doc: MongoDocument): T {
  const { _id, ...rest } = doc
  return {
    id: normalizeId(_id),
    ...rest,
  } as T
}

/**
 * Translates the sort field from React Admin format to MongoDB format
 * - 'id' becomes '_id' (MongoDB uses _id)
 */
function translateSortField(field: string): string {
  return field === 'id' ? '_id' : field
}

/**
 * Translates React Admin filter to MongoDB query
 * - Handles 'q' key for text search ($text)
 * - Passes through MongoDB operators
 */
function translateFilter(filter: FilterPayload): Record<string, unknown> {
  const mongoFilter: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(filter)) {
    if (key === 'q' && typeof value === 'string') {
      // Text search
      mongoFilter.$text = { $search: value }
    } else {
      // Pass through as-is (supports MongoDB operators like $gte, $in, etc.)
      mongoFilter[key] = value
    }
  }

  return mongoFilter
}

/**
 * Creates a DataProvider for mongo.do
 *
 * @example
 * ```typescript
 * import { MongoClient } from 'mongo.do'
 * import { createMondoDataProvider } from 'shadmin-mondo'
 *
 * const client = new MongoClient('your-connection-string')
 * const dataProvider = createMondoDataProvider({ client, database: 'myapp' })
 * ```
 */
export function createMondoDataProvider(options: MondoDataProviderOptions): DataProvider {
  const { client, database } = options
  const db = client.db(database)

  return {
    /**
     * Get a list of records with pagination, sorting, and filtering
     */
    getList: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetListParams
    ): Promise<GetListResult<RecordType>> => {
      const { pagination, sort, filter } = params
      const { page, perPage } = pagination
      const skip = (page - 1) * perPage

      const collection = db.collection(resource)
      const mongoFilter = translateFilter(filter)
      const sortField = translateSortField(sort.field)
      const sortDirection = sort.order === 'ASC' ? 1 : -1

      // Use aggregation pipeline for flexibility
      const pipeline: Record<string, unknown>[] = []

      // Add $match stage if there are filters
      if (Object.keys(mongoFilter).length > 0) {
        pipeline.push({ $match: mongoFilter })
      }

      // Add $sort stage
      pipeline.push({ $sort: { [sortField]: sortDirection } })

      // Use $facet to get both data and total count in one query
      pipeline.push({
        $facet: {
          data: [{ $skip: skip }, { $limit: perPage }],
          total: [{ $count: 'count' }],
        },
      })

      const [result] = await collection.aggregate<{
        data: MongoDocument[]
        total: Array<{ count: number }>
      }>(pipeline).toArray()

      const data = (result?.data ?? []).map((doc) => documentToRecord<RecordType>(doc))
      const total = result?.total[0]?.count ?? 0

      return { data, total }
    },

    /**
     * Get a single record by id
     */
    getOne: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetOneParams
    ): Promise<GetOneResult<RecordType>> => {
      const collection = db.collection(resource)
      const doc = await collection.findOne({ _id: String(params.id) })

      if (!doc) {
        throw new Error(`Record not found: ${resource}/${params.id}`)
      }

      return { data: documentToRecord<RecordType>(doc) }
    },

    /**
     * Get multiple records by their ids
     */
    getMany: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyParams
    ): Promise<GetManyResult<RecordType>> => {
      if (params.ids.length === 0) {
        return { data: [] }
      }

      const collection = db.collection(resource)
      const stringIds = params.ids.map(String)
      const docs = await collection.find({ _id: { $in: stringIds } }).toArray()

      return { data: docs.map((doc) => documentToRecord<RecordType>(doc)) }
    },

    /**
     * Get records related to another record (e.g., comments for a post)
     */
    getManyReference: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> => {
      const { target, id, pagination, sort, filter } = params
      const { page, perPage } = pagination
      const skip = (page - 1) * perPage

      const collection = db.collection(resource)

      // Combine target filter with additional filters
      const baseFilter = translateFilter(filter)
      const mongoFilter = { [target]: String(id), ...baseFilter }

      const sortField = translateSortField(sort.field)
      const sortDirection = sort.order === 'ASC' ? 1 : -1

      const pipeline: Record<string, unknown>[] = [
        { $match: mongoFilter },
        { $sort: { [sortField]: sortDirection } },
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: perPage }],
            total: [{ $count: 'count' }],
          },
        },
      ]

      const [result] = await collection.aggregate<{
        data: MongoDocument[]
        total: Array<{ count: number }>
      }>(pipeline).toArray()

      const data = (result?.data ?? []).map((doc) => documentToRecord<RecordType>(doc))
      const total = result?.total[0]?.count ?? 0

      return { data, total }
    },

    /**
     * Create a new record
     */
    create: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: CreateParams<TVariables>
    ): Promise<CreateResult<RecordType>> => {
      const collection = db.collection(resource)

      // Strip id from input data (MongoDB will generate _id)
      const { id: _clientId, ...dataWithoutId } = params.data as Record<string, unknown>

      const insertResult = await collection.insertOne(dataWithoutId as MongoDocument)
      const insertedId = normalizeId(insertResult.insertedId)

      // Fetch the created document to return complete data
      const doc = await collection.findOne({ _id: insertedId })

      if (!doc) {
        throw new Error(`Failed to fetch created record: ${resource}/${insertedId}`)
      }

      return { data: documentToRecord<RecordType>(doc) }
    },

    /**
     * Update an existing record
     */
    update: async <RecordType extends RaRecord = RaRecord, TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateParams<TVariables>
    ): Promise<UpdateResult<RecordType>> => {
      const collection = db.collection(resource)
      const { id, data } = params

      // Strip id from update data
      const { id: _dataId, ...updateData } = data as Record<string, unknown>

      const result = await collection.updateOne({ _id: String(id) }, { $set: updateData })

      if (result.matchedCount === 0) {
        throw new Error(`Record not found: ${resource}/${id}`)
      }

      // Fetch the updated document
      const doc = await collection.findOne({ _id: String(id) })

      if (!doc) {
        throw new Error(`Failed to fetch updated record: ${resource}/${id}`)
      }

      return { data: documentToRecord<RecordType>(doc) }
    },

    /**
     * Update multiple records
     */
    updateMany: async <TVariables = Record<string, unknown>>(
      resource: string,
      params: UpdateManyParams<TVariables>
    ): Promise<UpdateManyResult> => {
      if (params.ids.length === 0) {
        return { data: [] }
      }

      const collection = db.collection(resource)
      const stringIds = params.ids.map(String)

      // Strip id from update data
      const { id: _dataId, ...updateData } = params.data as Record<string, unknown>

      await collection.updateMany({ _id: { $in: stringIds } }, { $set: updateData })

      return { data: params.ids }
    },

    /**
     * Delete a single record
     */
    delete: async <RecordType extends RaRecord = RaRecord>(
      resource: string,
      params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
      const collection = db.collection(resource)
      const { id, previousData } = params

      // If previousData is provided, use it; otherwise fetch before delete
      let recordData: RecordType
      if (previousData) {
        recordData = previousData as RecordType
      } else {
        const doc = await collection.findOne({ _id: String(id) })
        if (doc) {
          recordData = documentToRecord<RecordType>(doc)
        } else {
          recordData = { id } as RecordType
        }
      }

      await collection.deleteOne({ _id: String(id) })

      return { data: recordData }
    },

    /**
     * Delete multiple records
     */
    deleteMany: async (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> => {
      if (params.ids.length === 0) {
        return { data: [] }
      }

      const collection = db.collection(resource)
      const stringIds = params.ids.map(String)

      await collection.deleteMany({ _id: { $in: stringIds } })

      return { data: params.ids }
    },
  }
}
