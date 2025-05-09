'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { region, department, cities } from '@/lib/types/types';
import { getDepartments, getCities, searchLocation } from '@/lib/req/ghost';
import Loader from '@/lib/loaders/Loader';
import { FilterDto } from '@/lib/validation/all.schema';

type Selected = { id: number; name: string; type: 'region' | 'department' | 'city' };

export default function LocationDropdown({ regions }: { regions: region }) {
  const { setValue, getValues } = useFormContext<FilterDto>();
  const [selected, setSelected] = useState<Selected[]>([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'region' | 'departments' | 'cities' | 'search'>('region');
  const [deps, setDeps] = useState<department>([]);
  const [cities, setCities] = useState<cities>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState<{ regions: region; departments: department; cities: cities } | null>({
    regions: [],
    departments: [],
    cities: [],
  });

  useEffect(() => {
    setView('region');
  }, [open]);

  useEffect(() => {
    const defaultVal = getValues().locationIds;
    if (defaultVal && defaultVal.length > 0) {
      setSelected(defaultVal);
    }
  }, []);

  useEffect(() => {
    const cleaned = selected.filter(s => s.id != null && s.type != null && s.name != null);
    setValue('locationIds', cleaned);
  }, [selected, setValue]);

  const updateSelection = (item: Selected) => {
    setSelected(prev => {
      const exists = prev.find(s => s.id === item.id && s.type === item.type);
      return exists
        ? prev.filter(s => !(s.id === item.id && s.type === item.type))
        : [...prev, item];
    });
  };

  const fetchDepartments = async (regionId: number) => {
    setLoading(true);
    const data = await getDepartments(regionId);
    setDeps(data || []);
    setView('departments');
    setLoading(false);
  };

  const fetchCities = async (depId: number) => {
    setLoading(true);
    const data = await getCities(depId);
    setCities(data || []);
    setView('cities');
    setLoading(false);
  };

  const doSearch = async (text: string) => {
    setSearch(text);
    if (!text) {
      setView('region');
      return;
    }
    setLoading(true);
    const res = await searchLocation(text);
    setFiltered(res);
    setView('search');
    setLoading(false);
  };

  const renderItem = (item: Selected, childAction?: () => void, showChild = false) => (
    <div
      key={`${item.type}-${item.id}`}
      className="flex justify-between items-center hover:bg-gray-100 p-2 rounded cursor-pointer"
      onClick={() => updateSelection(item)}
    >
      <div className="flex items-center gap-2">
        <Checkbox checked={selected.some(s => s.id === item.id && s.type === item.type)} />
        <span className="text-sm">{item.name}</span>
      </div>
      {showChild && childAction && (
        <button
          onClick={e => {
            e.stopPropagation();
            childAction();
          }}
          className="text-xs text-gray-600 hover:underline"
        >
          Voir plus
        </button>
      )}
    </div>
  );

  const clearAll = () => setSelected([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full truncate max-h-16 text-left flex font-normal text-sm justify-between items-center"
          title={selected.map(s => s.name).join(', ')}
        >
          <span className="truncate ">
            {selected.length > 0 ? selected.map(s => s.name).join(', ') : `Sélectionner une localisation`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-2">
        <input
          type="text"
          placeholder="Rechercher une localisation"
          className="border px-3 py-2 mb-2 w-full rounded text-sm"
          onChange={e => doSearch(e.target.value)}
        />

        <div className="flex flex-col gap-2 max-h-60 overflow-auto">
          {loading ? (
            <Loader />
          ) : view === 'region' ? (
            regions.map(r =>
              renderItem({ id: r.id, name: r.name, type: 'region' }, () => fetchDepartments(r.id), true)
            )
          ) : view === 'departments' ? (
            deps.map(d =>
              renderItem({ id: d.id, name: d.name, type: 'department' }, () => fetchCities(d.id), true)
            )
          ) : view === 'cities' ? (
            cities.map(c => renderItem({ id: c.id, name: c.name, type: 'city' }))
          ) : (
            <>
              {filtered?.regions.map(r =>
                renderItem({ id: r.id, name: r.name, type: 'region' }, () => fetchDepartments(r.id), true)
              )}
              {filtered?.departments.map(d =>
                renderItem({ id: d.id, name: d.name, type: 'department' }, () => fetchCities(d.id), true)
              )}
              {filtered?.cities.map(c => renderItem({ id: c.id, name: c.name, type: 'city' }))}
            </>
          )}
        </div>

        {selected.length > 0 && (
          <div className="mt-2 text-right">
            <button onClick={clearAll} className="text-xs text-gray-500 hover:underline">
              Réinitialiser la sélection
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
