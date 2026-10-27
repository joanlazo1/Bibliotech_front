import type { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
}

function ServiceCard({
  icon: Icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <article className="service-card">
      <div className="service-icon">
        <Icon size={22} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  )
}

export default ServiceCard
