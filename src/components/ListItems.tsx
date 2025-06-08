import { Link as LinkType } from '@/db/schema';
import Link from 'next/link';
import { Icon } from './Icon';

export function ListItems({ links }: { links: LinkType[] }) {
  return (
    <div className="border-default bg-high overflow-hidden rounded-lg border shadow-sm">
      {/* Header row */}
      <div className="bg-elevated border-default grid grid-cols-[1fr_3fr_3fr_2fr] items-center gap-2 border-b px-6 py-4 text-sm font-medium text-gray-400">
        <div className="truncate">Icon</div>
        <div className="truncate">Name</div>
        <div className="truncate">Description</div>
        <div className="truncate">Recommended?</div>
      </div>

      {/* Link rows */}
      <div className="divide-default divide-y">
        {links
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map(link => (
            <Link key={link.id} href={`/links/${link.id}`} className="hover:bg-elevated block transition-colors">
              <div className="grid grid-cols-[1fr_3fr_3fr_2fr] items-center gap-2 px-6 py-4">
                <div className="truncate">
                  <Icon icon={link?.icon ?? ''} alt={link.name} />
                </div>
                <div className="line-clamp-2 font-medium">{link.name}</div>
                <div className="line-clamp-2">{link.description}</div>
                <div className="truncate text-sm text-gray-400">{link.isRecommended ? 'Yes' : ''}</div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
