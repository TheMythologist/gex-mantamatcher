import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useRef } from 'react';
import LazyImage from '../components/lazy-image';
import TextWithTooltip from '../components/text-with-tooltip';

export type species = 'Alfredi' | 'Birostris';
export type sex = 'U' | 'M' | 'F'; // Unknown, male or female
export type pigmentation = 'L' | 'M' | 'N';
export type unsureBoolean = 'U' | 'Y' | 'N'; // Unknown, yes or no
export type sureBoolean = 'Y' | 'N'; // Yes or no

export type Manta = {
  [key: string]: string;
};

export default memo(function MantaRows({ mantas }: { mantas: Manta[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: mantas.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
    measureElement: element => element?.getBoundingClientRect().height ?? 200,
  });

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-row bg-teal-600 text-white p-2 sticky top-0 z-10 gap-2">
        <div className="flex-3 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">ID</div>
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Species</div>
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Sex</div>
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Pigmentation</div>
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Cephalic</div> Fin Injury
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Bent</div> Pectoral Injury
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Fishing</div> Line Injury
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">IB</div> Dots
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Pattern</div>
        </div>
        <div className="flex-1 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Injury</div>
        </div>
        <div className="flex-3 font-bold text-sm min-w-0 border-r border-teal-400 pr-2 pl-2">
          <div className="line-clamp-2 break-words">Notes</div>
        </div>
      </div>

      <div ref={parentRef} className="overflow-auto bg-white" style={{ height: '70vh' }}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map(virtualItem => {
            const manta = mantas[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="flex flex-row items-start gap-2 px-2 border-b border-gray-200 py-2 min-h-0"
              >
                <div className="flex-3 flex flex-col gap-2 min-w-0 border-r border-gray-200 pr-2">
                  <TextWithTooltip text={manta.id} className="text-sm font-medium" maxLines={2} />
                  <LazyImage
                    src={`static://images/${manta.id}.jpg`}
                    alt={`Manta ${manta.id}`}
                    className="w-full rounded object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.species} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.sex} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.pigmentation} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.hasCephalicFinInjury} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip
                    text={manta.hasBentPectoralOrTruncationInjury}
                    className="text-sm"
                  />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.hasFishingLineInjury} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.ibDots} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.pattern} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center border-r border-gray-200 pr-2 pl-2 self-stretch">
                  <TextWithTooltip text={manta.injury} className="text-sm" />
                </div>
                <div className="flex-3 min-w-0 flex items-center pl-2 self-stretch">
                  <TextWithTooltip text={manta.notes} className="text-sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
