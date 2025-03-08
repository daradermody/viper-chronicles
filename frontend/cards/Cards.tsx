import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Typography } from '@mui/material'

import './card.css'

export function Cards({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <div className={clsx('card-grid', { small })}>
      {children}
    </div>
  )
}

interface CardProps {
  linkTo?: string;
  disabled?: boolean;
  children: ReactNode[]
  imageLeftOnMobile?: boolean;
}

export function Card({ children, linkTo, disabled, imageLeftOnMobile }: CardProps) {
  if (linkTo) {
    return (
      <Link to={linkTo} className="card-link">
        <div className={clsx('card', { disabled })}>{children}</div>
      </Link>
    )
  } else {
    return <div className={clsx('card', { disabled })}>{children}</div>
  }
}

interface CardMediaProps {
  image: string;
  width?: string;
  height?: string;
  alt?: string;
  orientation?: 'landscape' | 'portrait';
}

export function CardMedia({ width, height, image, alt, orientation }: CardMediaProps) {
  return (
    <img
      className={clsx('card-media', { portrait: orientation === 'portrait' })}
      src={image}
      alt={alt}
      height={height}
      width={width}
    />
  )
}

interface CardContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode[];
}

export function CardContent({ title, subtitle, description, actions }: CardContentProps) {
  return (
    <div className="card-content">
      {title && (
        <Typography variant="body1">
          <b>{title}</b>
        </Typography>
      )}

      {subtitle && (
        <Typography variant="caption" sx={{ marginBottom: '4px' }}>
          <i>{subtitle}</i>
        </Typography>
      )}

      {description && (
        <Typography variant="caption" className="card-description">
          {description}
        </Typography>
      )}

      {actions && actions.map((action, i) => (
        <div key={i} onClick={e => e.stopPropagation()}>
          {action}
        </div>
      ))}
    </div>
  )
}
