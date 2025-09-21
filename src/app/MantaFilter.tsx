import { memo, type Dispatch, type SetStateAction } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/shadcn/Select';
import { Input } from '../components/shadcn/Input';

export interface MantaFilterType {
  species: string;
  sex: string;
  pigmentation: string;
  dotNumber: number;
  dotPattern: string;
  lungPattern: string;
  shadingType: string;
  patchType: string;
  searchNotes: string;
}
// TODO: Integrate miscellaneous filters such as AP (ArmPit) and I (Island)

interface MantaFilterProps {
  filters: Partial<MantaFilterType>;
  setFilters: Dispatch<SetStateAction<Partial<MantaFilterType>>>;
}

export default memo(function MantaFilter({ filters, setFilters }: MantaFilterProps) {
  return (
    <div>
      <div>Select your filters!</div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1">
          <Select
            value={filters.species}
            onValueChange={value => setFilters(prev => ({ ...prev, species: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Alfredi">Alfredi</SelectItem>
                <SelectItem value="Birostris">Birostris</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.sex}
            onValueChange={value => setFilters(prev => ({ ...prev, sex: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="U">Unknown</SelectItem>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.pigmentation}
            onValueChange={value => setFilters(prev => ({ ...prev, pigmentation: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select pigmentation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="U">Unknown</SelectItem>
                <SelectItem value="N">Normal</SelectItem>
                <SelectItem value="M">Melanistic</SelectItem>
                <SelectItem value="L">Leucistic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* TODO: Reset other filters that are affected by L or M */}
          <Input
            type="number"
            placeholder="Number of spots"
            className="w-full"
            value={filters.dotNumber}
            onChange={e =>
              setFilters(prev => ({ ...prev, dotNumber: Number.parseInt(e.target.value, 10) }))
            }
            disabled={filters.pigmentation === 'L' || filters.pigmentation === 'M'}
          />

          <Select
            value={filters.dotPattern}
            onValueChange={value => setFilters(prev => ({ ...prev, dotPattern: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select dot pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="U">Unknown</SelectItem>
                <SelectItem value="E">Empty</SelectItem>
                <SelectItem value="S">Sparse</SelectItem>
                <SelectItem value="D">Dots</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Select
            value={filters.lungPattern}
            onValueChange={value => setFilters(prev => ({ ...prev, lungPattern: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select lung pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="U">Unknown</SelectItem>
                <SelectItem value="L0">L0</SelectItem>
                <SelectItem value="L1">L1</SelectItem>
                <SelectItem value="L2">L2</SelectItem>
                <SelectItem value="L+">L+</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.shadingType}
            onValueChange={value => setFilters(prev => ({ ...prev, shadingType: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select shading type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="U">Unknown</SelectItem>
                <SelectItem value="NS">No Shading</SelectItem>
                <SelectItem value="TS">Trailing Shading</SelectItem>
                <SelectItem value="WS">Wing Shading</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.patchType}
            onValueChange={value => setFilters(prev => ({ ...prev, patchType: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select patch type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="U">Unknown</SelectItem>
                <SelectItem value="GP" disabled={filters.pigmentation === 'M'}>
                  Gill Patch
                </SelectItem>
                <SelectItem value="BP" disabled={filters.pigmentation === 'M'}>
                  Belly Patch
                </SelectItem>
                <SelectItem value="DP" disabled={filters.pigmentation !== 'M'}>
                  Double Patch
                </SelectItem>
                <SelectItem value="J" disabled={filters.pigmentation !== 'M'}>
                  Jet Black
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search Notes"
            className="w-full"
            value={filters.searchNotes}
            onChange={e => setFilters(prev => ({ ...prev, searchNotes: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
});
