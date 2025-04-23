"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSupabaseData, useSupabaseInsert, useSupabaseDelete } from "@/hooks/use-supabase-data"
import { Loader2, Plus, RefreshCw, Trash } from "lucide-react"

type ExampleItem = {
  id: string
  name: string
  created_at: string
}

export function SupabaseDataExample() {
  const [newItemName, setNewItemName] = useState("")

  // Fetch data
  const {
    data: items,
    loading: loadingItems,
    error: fetchError,
    refetch,
  } = useSupabaseData<ExampleItem[]>("example_items", (query) =>
    query.select("*").order("created_at", { ascending: false }),
  )

  // Insert data
  const { insert, loading: insertLoading, error: insertError } = useSupabaseInsert<ExampleItem>("example_items")

  // Delete data
  const { remove, loading: deleteLoading, error: deleteError } = useSupabaseDelete("example_items")

  const handleAddItem = async () => {
    if (!newItemName.trim()) return

    const { error } = await insert({ name: newItemName })

    if (!error) {
      setNewItemName("")
      refetch()
    }
  }

  const handleDeleteItem = async (id: string) => {
    const { error } = await remove({ column: "id", value: id })

    if (!error) {
      refetch()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Data Example</CardTitle>
        <CardDescription>Example of using Supabase data hooks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new item form */}
        <div className="space-y-2">
          <Label htmlFor="new-item">Add New Item</Label>
          <div className="flex gap-2">
            <Input
              id="new-item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name"
              disabled={insertLoading}
            />
            <Button onClick={handleAddItem} disabled={insertLoading || !newItemName.trim()}>
              {insertLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>
        </div>

        {/* Error messages */}
        {(fetchError || insertError || deleteError) && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{fetchError || insertError || deleteError}</AlertDescription>
          </Alert>
        )}

        {/* Items list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Items</Label>
            <Button variant="outline" size="sm" onClick={refetch} disabled={loadingItems}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loadingItems ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {loadingItems ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading items...</span>
            </div>
          ) : items && items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)} disabled={deleteLoading}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No items found. Add some items to see them here.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        This example uses the example_items table. Make sure it exists in your database.
      </CardFooter>
    </Card>
  )
}
