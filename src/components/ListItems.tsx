import { Link as LinkType } from '@/db/schema';
import Link from 'next/link';
import { Icon } from './Icon';

export function ListItems({ links }: { links: LinkType[] }) {
  return (
    <div className="border-default bg-high overflow-hidden rounded-lg border shadow-sm">
      {/* Desktop Header - Hidden on mobile */}
      <div className="sm:border-default sm:bg-elevated hidden sm:grid sm:grid-cols-[1fr_3fr_3fr_2fr] sm:items-center sm:gap-2 sm:border-b sm:px-6 sm:py-4 sm:text-sm sm:font-medium sm:text-gray-400">
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
              {/* Mobile Card Design */}
              <div className="sm:hidden">
                <div className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0">
                    <Icon icon={link?.icon ?? ''} alt={link.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium">{link.name}</h3>
                      {link.isRecommended && (
                        <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{link.description}</p>
                    {link.category && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {link.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Table Design */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_3fr_3fr_2fr] sm:items-center sm:gap-2 sm:px-6 sm:py-4">
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
