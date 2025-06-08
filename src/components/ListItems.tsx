import { Link as LinkType } from '@/db/schema';
import Link from 'next/link';
import { Icon } from './Icon';

export function ListItems({ links }: { links: LinkType[] }) {
  return (
    <div className="border-default bg-high overflow-hidden overflow-x-scroll rounded-lg border shadow-sm">
      {/* Header row */}
      <div className="bg-elevated border-default grid grid-cols-9 gap-2 border-b px-6 py-3 text-sm font-medium text-gray-400 sm:grid-cols-12">
        <div className="col-span-1">Icon</div>
        <div className="col-span-3 sm:col-span-4">Name</div>
        <div className="col-span-3 sm:col-span-4">Description</div>
        <div className="col-span-2 sm:col-span-3">Recommended?</div>
      </div>

      {/* Link rows */}
      <div className="divide-default divide-y">
        {links
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map(link => (
            <Link key={link.id} href={`/links/${link.id}`} className="hover:bg-elevated block transition-colors">
              <div className="grid grid-cols-9 items-start gap-2 px-6 py-4 sm:grid-cols-12">
                <div className="col-span-1 truncate">
                  <Icon icon={link.icon} alt={link.name} />
                </div>
                <div className="col-span-3 line-clamp-2 font-medium sm:col-span-4 sm:truncate">{link.name}</div>
                <div className="col-span-3 line-clamp-3 sm:col-span-4">{link.description}</div>
                <div className="col-span-2 truncate text-sm text-gray-400 sm:col-span-3">{link.isRecommended ? 'Yes' : ''}</div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
