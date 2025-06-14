"use client"

import { useState, useEffect } from "react"
import {
  getContacts,
  searchContacts as searchContactsDB,
  addContact as addContactDB,
  updateContact as updateContactDB,
  deleteContact as deleteContactDB,
} from "@/lib/database"
import type { Contact } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load contacts on mount
  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await getContacts()
      setContacts(data)
    } catch (error) {
      console.error("Failed to load contacts:", error)
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const searchContacts = async (searchTerm: string) => {
    try {
      const data = await searchContactsDB(searchTerm)
      setContacts(data)
    } catch (error) {
      console.error("Failed to search contacts:", error)
    }
  }

  const addContact = async (contactData: {
    name: string
    email?: string
    phone?: string
    company?: string
    role?: string
    tags: string[]
  }) => {
    try {
      const newContact = await addContactDB(contactData)
      setContacts((prev) => [newContact, ...prev])
      toast({
        title: "Success",
        description: "Contact added successfully",
      })
      return newContact
    } catch (error) {
      console.error("Failed to add contact:", error)
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const updatedContact = await updateContactDB(id, updates)
      setContacts((prev) => prev.map((contact) => (contact.id === id ? updatedContact : contact)))
      toast({
        title: "Success",
        description: "Contact updated successfully",
      })
      return updatedContact
    } catch (error) {
      console.error("Failed to update contact:", error)
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteContact = async (id: string) => {
    try {
      await deleteContactDB(id)
      setContacts((prev) => prev.filter((contact) => contact.id !== id))
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete contact:", error)
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      })
      throw error
    }
  }

  return {
    contacts,
    loading,
    searchContacts,
    addContact,
    updateContact,
    deleteContact,
    refreshContacts: loadContacts,
  }
}
