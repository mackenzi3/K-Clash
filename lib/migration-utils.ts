import { getServerSupabaseClient } from "./supabase"

/**
 * Runs a SQL migration script on the Supabase database
 * @param sql The SQL script to run
 * @returns Object containing success status and error message if any
 */
export async function runMigration(sql: string) {
  try {
    const supabase = getServerSupabaseClient()

    if (!supabase) {
      return {
        success: false,
        error: "Supabase client not initialized. Check your environment variables.",
      }
    }

    // Execute the SQL script
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      return {
        success: false,
        error: `Migration error: ${error.message}`,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns True if the table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const supabase = getServerSupabaseClient()

    if (!supabase) {
      return false
    }

    // Query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking if table exists:", error)
    return false
  }
}
