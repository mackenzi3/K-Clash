import { getBrowserSupabaseClient, getServerSupabaseClient } from "./supabase"
import { handleSupabaseError } from "./supabase-utils"

/**
 * Generic function to fetch data from Supabase with proper error handling
 * @param tableName The table to fetch from
 * @param query Function to build the query
 * @param isServer Whether to use the server client
 * @returns The fetched data and any error
 */
export async function fetchData<T>(
  tableName: string,
  query: (supabase: ReturnType<typeof getBrowserSupabaseClient>) => any,
  isServer = false,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = isServer ? getServerSupabaseClient() : getBrowserSupabaseClient()

    if (!supabase) {
      return {
        data: null,
        error: "Supabase client not initialized. Check your environment variables.",
      }
    }

    // Start with the table
    const baseQuery = supabase.from(tableName)

    // Apply the custom query function
    const { data, error } = await query(baseQuery)

    if (error) {
      return {
        data: null,
        error: handleSupabaseError(error),
      }
    }

    return {
      data: data as T,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    }
  }
}

/**
 * Generic function to insert data into Supabase with proper error handling
 * @param tableName The table to insert into
 * @param data The data to insert
 * @param isServer Whether to use the server client
 * @returns The inserted data and any error
 */
export async function insertData<T>(
  tableName: string,
  data: any,
  isServer = false,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = isServer ? getServerSupabaseClient() : getBrowserSupabaseClient()

    if (!supabase) {
      return {
        data: null,
        error: "Supabase client not initialized. Check your environment variables.",
      }
    }

    const { data: result, error } = await supabase.from(tableName).insert(data).select()

    if (error) {
      return {
        data: null,
        error: handleSupabaseError(error),
      }
    }

    return {
      data: result as T,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    }
  }
}

/**
 * Generic function to update data in Supabase with proper error handling
 * @param tableName The table to update
 * @param data The data to update
 * @param match The column and value to match for the update
 * @param isServer Whether to use the server client
 * @returns The updated data and any error
 */
export async function updateData<T>(
  tableName: string,
  data: any,
  match: { column: string; value: any },
  isServer = false,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = isServer ? getServerSupabaseClient() : getBrowserSupabaseClient()

    if (!supabase) {
      return {
        data: null,
        error: "Supabase client not initialized. Check your environment variables.",
      }
    }

    const { data: result, error } = await supabase.from(tableName).update(data).eq(match.column, match.value).select()

    if (error) {
      return {
        data: null,
        error: handleSupabaseError(error),
      }
    }

    return {
      data: result as T,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    }
  }
}

/**
 * Generic function to delete data from Supabase with proper error handling
 * @param tableName The table to delete from
 * @param match The column and value to match for deletion
 * @param isServer Whether to use the server client
 * @returns Success status and any error
 */
export async function deleteData(
  tableName: string,
  match: { column: string; value: any },
  isServer = false,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = isServer ? getServerSupabaseClient() : getBrowserSupabaseClient()

    if (!supabase) {
      return {
        success: false,
        error: "Supabase client not initialized. Check your environment variables.",
      }
    }

    const { error } = await supabase.from(tableName).delete().eq(match.column, match.value)

    if (error) {
      return {
        success: false,
        error: handleSupabaseError(error),
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    }
  }
}
