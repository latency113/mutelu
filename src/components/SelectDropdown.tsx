'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  value: string;
  onValueChange: (val: string) => void;
  placeholder: string;
  options: SelectOption[];
  ariaLabel?: string;
  className?: string;
}

export default function SelectDropdown({
  value,
  onValueChange,
  placeholder,
  options,
  ariaLabel,
  className = '',
}: SelectDropdownProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={ariaLabel || placeholder}
        className={`w-full flex items-center justify-between px-2.5 sm:px-3 py-3 rounded-xl bg-purple-950/70 border border-purple-700/50 hover:border-amber-400/60 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-white text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-inner group data-[placeholder]:text-purple-400/70 ${className}`}
      >
        <span className="truncate text-center flex-1">
          <Select.Value placeholder={placeholder} />
        </span>
        <Select.Icon asChild>
          <ChevronDown className="w-4 h-4 text-purple-400 shrink-0 ml-1 group-hover:text-amber-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] max-w-[95vw] overflow-hidden rounded-2xl bg-[#160a33]/98 backdrop-blur-2xl border border-amber-500/40 text-purple-100 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.25)] animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-[#160a33] text-amber-300 cursor-default hover:bg-purple-900/40">
            <ChevronUp className="w-3.5 h-3.5" />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1 max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="relative flex items-center justify-between px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm text-purple-200 font-medium select-none outline-none data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-amber-500/20 data-[highlighted]:to-purple-600/30 data-[highlighted]:text-amber-200 data-[state=checked]:text-amber-300 data-[state=checked]:bg-purple-900/40 data-[state=checked]:font-semibold cursor-pointer transition-colors"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator className="ml-2 inline-flex items-center text-amber-400">
                  <Check className="w-3.5 h-3.5" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-[#160a33] text-amber-300 cursor-default hover:bg-purple-900/40">
            <ChevronDown className="w-3.5 h-3.5" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
