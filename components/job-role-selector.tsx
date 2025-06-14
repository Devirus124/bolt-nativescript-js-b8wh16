"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search } from "lucide-react"

interface JobRoleSelectorProps {
  onRoleChange: (role: string) => void
}

export function JobRoleSelector({ onRoleChange }: JobRoleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [customRole, setCustomRole] = useState("")

  const popularRoles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX/UI Designer",
    "Marketing Manager",
    "Sales Representative",
    "Customer Success Manager",
    "Project Manager",
  ]

  const filteredRoles = popularRoles.filter((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    onRoleChange(role)
  }

  const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRole(e.target.value)
    if (e.target.value) {
      setSelectedRole("custom")
      onRoleChange(e.target.value)
    } else {
      setSelectedRole("")
      onRoleChange("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="job-search" className="text-base font-medium">
          Select your target job role
        </Label>
        <p className="text-sm text-muted-foreground mb-4">We'll optimize your resume specifically for this role</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="job-search"
            type="search"
            placeholder="Search job roles or enter your own"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Popular job roles</Label>
        <RadioGroup
          value={selectedRole}
          onValueChange={handleRoleSelect}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2"
        >
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <RadioGroupItem value={role} id={role.replace(/\s+/g, "-").toLowerCase()} />
                <Label htmlFor={role.replace(/\s+/g, "-").toLowerCase()} className="cursor-pointer">
                  {role}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-2">
              No matching roles found. Please enter a custom role below.
            </p>
          )}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="custom-role" className="text-base font-medium">
          Custom job role
        </Label>
        <div className="flex items-center space-x-2 mt-2">
          <RadioGroupItem
            value="custom"
            id="custom-role-radio"
            checked={selectedRole === "custom"}
            onCheckedChange={() => {
              if (customRole) {
                setSelectedRole("custom")
                onRoleChange(customRole)
              }
            }}
          />
          <Input
            id="custom-role"
            placeholder="Enter a specific job title"
            value={customRole}
            onChange={handleCustomRoleChange}
            onClick={() => {
              if (customRole) {
                setSelectedRole("custom")
                onRoleChange(customRole)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
