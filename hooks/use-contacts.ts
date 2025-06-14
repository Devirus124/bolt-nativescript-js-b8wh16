"use client"

import { useState, useEffect } from "react"
import { contactService, type Contact } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load contacts
  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await contactService.getAll()
      setContacts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts")
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Search contacts
  const searchContacts = async (query: string) => {
    try {
      setLoading(true)
      const data = query ? await contactService.search(query) : await contactService.getAll()
      setContacts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search contacts")
      toast({
        title: "Error",
        description: "Failed to search contacts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add contact
  const addContact = async (contactData: Omit<Contact, "id" | "created_at" | "updated_at">) => {
    try {
      const newContact = await contactService.create(contactData)
      setContacts((prev) => [newContact, ...prev])
      toast({
        title: "Success",
        description: "Contact added successfully",
      })
      return newContact
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      })
      throw err
    }
  }

  // Update contact
  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const updatedContact = await contactService.update(id, updates)
      setContacts((prev) => prev.map((contact) => (contact.id === id ? updatedContact : contact)))
      toast({
        title: "Success",
        description: "Contact updated successfully",
      })
      return updatedContact
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      })
      throw err
    }
  }

  // Delete contact
  const deleteContact = async (id: string) => {
    try {
      await contactService.delete(id)
      setContacts((prev) => prev.filter((contact) => contact.id !== id))
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  return {
    contacts,
    loading,
    error,
    loadContacts,
    searchContacts,
    addContact,
    updateContact,
    deleteContact,
  }
}
