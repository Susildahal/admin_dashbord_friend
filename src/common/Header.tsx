"use client"

import React from 'react'
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useNavigate, NavLink } from 'react-router-dom'

interface HeaderProps {
  title: string
  titledesc?: string
  linkname?: string
  link?: string
  onClickLink?: () => void
  additionalActions?: React.ReactNode
  addionaldelete?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, titledesc = '', linkname = '', link = '', onClickLink, additionalActions ,addionaldelete }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='flex items-center justify-between  mb-2 w-full gap-4 flex-wrap'>
      <div className='flex items-center gap-4'>
        <ArrowLeft className='h-5 w-5 cursor-pointer' onClick={handleBack} />
        <div className='flex flex-col'>
          <h2 className='text-lg font-medium'>{title}</h2>
          {titledesc && <p className='text-sm text-muted-foreground'>{titledesc}</p>}
        </div>
      </div>

      <div className='flex items-center gap-2 flex-wrap'>
        {addionaldelete}
        {additionalActions}
        {onClickLink ? (
          <Button variant="default" size="sm" onClick={onClickLink}>
            <Plus className='mr-2 h-4 w-4' />{linkname || 'Add'}
          </Button>
        ) : link ? (
          <NavLink to={link}>
            <Button variant="default" size="sm">
              <Plus className='mr-2 h-4 w-4' />{linkname || 'Add'}
            </Button>
          </NavLink>
        ) : null}
      </div>
    </div>
  )
}

export default Header