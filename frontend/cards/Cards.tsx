import { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Typography } from '@mui/material'
import { Episode } from '../../types'

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
  style?: CSSProperties;
}

export function Card({ children, linkTo, disabled, imageLeftOnMobile, style }: CardProps) {
  if (linkTo) {
    return (
      <Link to={linkTo} className="card-link">
        <div className={clsx('card', { disabled })} style={style}>{children}</div>
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
  className?: string;
  style?: CSSProperties;
}

export function CardMedia({ width, height, image, alt, orientation, className, style }: CardMediaProps) {
  return (
    <img
      className={clsx('card-media', { portrait: orientation === 'portrait' }, className)}
      src={image}
      alt={alt}
      height={height}
      width={width}
      style={style}
    />
  )
}

interface CardContentProps {
  title?: string | ReactNode;
  subtitle?: string;
  description?: string;
  actions?: ReactNode[];
}

export function CardContent({ title, subtitle, description, actions }: CardContentProps) {
  return (
    <div className="card-content">
      {title && typeof title === 'string' && (
        <Typography variant="body1">
          <b>{title}</b>
        </Typography>
      )}
      {title && typeof title !== 'string' && title}

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

export function getThumbnail(episode: Episode): string {
  if (episode.thumbnail) {
    return episode.thumbnail
  } else if (episode.youtubeId) {
    return `https://i.ytimg.com/vi/${episode.youtubeId}/hqdefault.jpg`
  } else {
    return 'https://pbs.twimg.com/profile_images/80829742/scheadshot_400x400.jpg'
  }
}
