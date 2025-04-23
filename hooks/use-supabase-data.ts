"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchData, insertData, updateData, deleteData } from "@/lib/data-utils"

/**
 * Hook for fetching data from Supabase
 * @param tableName The table to fetch from
 * @param queryBuilder Function to build the query
 * @param dependencies Dependencies array for refetching
 * @returns The fetched data, loading state, error, and refetch function
 */
export function useSupabaseData<T>(tableName: string, queryBuilder: (query: any) => any, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDataFromSupabase = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: result, error: fetchError } = await fetchData<T>(tableName, queryBuilder)

    if (fetchError) {
      setError(fetchError)
    } else {
      setData(result)
    }

    setLoading(false)
  }, [tableName, queryBuilder])

  useEffect(() => {
    fetchDataFromSupabase()
  }, [...dependencies, fetchDataFromSupabase])

  return { data, loading, error, refetch: fetchDataFromSupabase }
}

/**
 * Hook for inserting data into Supabase
 * @param tableName The table to insert into
 * @returns Insert function, loading state, and error
 */
export function useSupabaseInsert<T>(tableName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insertedData, setInsertedData] = useState<T | null>(null)

  const insert = async (data: any) => {
    setLoading(true)
    setError(null)

    const { data: result, error: insertError } = await insertData<T>(tableName, data)

    if (insertError) {
      setError(insertError)
      setInsertedData(null)
    } else {
      setInsertedData(result)
    }

    setLoading(false)
    return { data: result, error: insertError }
  }

  return { insert, loading, error, insertedData }
}

/**
 * Hook for updating data in Supabase
 * @param tableName The table to update
 * @returns Update function, loading state, and error
 */
export function useSupabaseUpdate<T>(tableName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatedData, setUpdatedData] = useState<T | null>(null)

  const update = async (data: any, match: { column: string; value: any }) => {
    setLoading(true)
    setError(null)

    const { data: result, error: updateError } = await updateData<T>(tableName, data, match)

    if (updateError) {
      setError(updateError)
      setUpdatedData(null)
    } else {
      setUpdatedData(result)
    }

    setLoading(false)
    return { data: result, error: updateError }
  }

  return { update, loading, error, updatedData }
}

/**
 * Hook for deleting data from Supabase
 * @param tableName The table to delete from
 * @returns Delete function, loading state, and error
 */
export function useSupabaseDelete(tableName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const remove = async (match: { column: string; value: any }) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { success: result, error: deleteError } = await deleteData(tableName, match)

    if (deleteError) {
      setError(deleteError)
      setSuccess(false)
    } else {
      setSuccess(true)
    }

    setLoading(false)
    return { success: result, error: deleteError }
  }

  return { remove, loading, error, success }
}
