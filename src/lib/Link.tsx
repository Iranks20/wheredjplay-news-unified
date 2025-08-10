import React from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'
import { cn } from './utils'

export interface LinkProps extends RouterLinkProps {
	className?: string
	children: React.ReactNode
}

export function Link({ className, children, ...props }: LinkProps) {
	return (
		<RouterLink className={cn('cursor-pointer', className)} {...props}>
			{children}
		</RouterLink>
	)
}
