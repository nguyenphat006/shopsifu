'use client';

import { ChevronDown, Check } from 'lucide-react';
import React, { useRef } from 'react';
import { useChangeLang } from '@/hooks/useChangeLang';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { VN, US } from 'country-flag-icons/react/3x2';
import { useDropdown } from '../dropdown-context';

export function ChangeLangs() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { changeLanguage, currentLangName, currentSelectedLang } = useChangeLang();
  const { openDropdown, setOpenDropdown } = useDropdown();
  
  const isOpen = openDropdown === 'language';
  
  return (    
    <div 
      className="relative group flex items-center language-container" 
      ref={dropdownRef}
    >
      {/* Trigger Button */}      
      <div 
        className="cursor-pointer relative whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-3 text-black font-medium text-[13px]"
        onClick={() => setOpenDropdown(isOpen ? 'none' : 'language')}
        onMouseEnter={() => setOpenDropdown('language')}
      >
        {/* Backdrop blur effect */}
        <motion.div
          className="absolute rounded-full inset-0 backdrop-blur-sm"
          initial={{ 
            backgroundColor: "rgba(233, 233, 233, 0)", 
            scaleX: 0.5,
            scaleY: 0.8
          }}
          animate={{
            backgroundColor: isOpen ? "rgba(233, 233, 233, 0.4)" : "rgba(233, 233, 233, 0)", 
            boxShadow: isOpen
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "none",
            scaleX: isOpen ? 1 : 0.5,
            scaleY: isOpen ? 1 : 0.8
          }}
          whileHover={{
            backgroundColor: "rgba(233, 233, 233, 0.4)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            scaleX: [0.8, 1.1, 1], 
            scaleY: [0.9, 1.05, 1],
          }}
          transition={{
            type: "spring",
            stiffness: 350, 
            damping: 12, 
            backgroundColor: { duration: 0.15 }, 
            boxShadow: { duration: 0.15 }, 
            scaleX: { duration: 0.35, ease: "easeOut" }, 
            scaleY: { duration: 0.25, ease: "easeOut" },
          }}
        />
        
        {/* Content layer */}       
        <div className="relative z-10 w-7 h-7 overflow-hidden flex-shrink-0">
          {currentSelectedLang === 'vi' ? (
            <VN title="Tiếng Việt" className="w-full h-full object-cover" />
          ) : (
            <US title="English" className="w-full h-full object-cover" />
          )}
        </div>
        <span className="z-10 relative ml-1.5 text-white">{currentLangName}</span>
        <motion.span
          className="z-10 relative"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </motion.span>
      </div>
      
      {/* Invisible gap to prevent dropdown from closing when moving cursor to dropdown */}
      <div className="absolute h-3 w-full top-full"></div>
      
      {/* Dropdown Menu */}
      <motion.div
        className={cn(
          "absolute top-[calc(100%+3px)] right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onMouseEnter={() => setOpenDropdown('language')}
        onMouseLeave={() => setOpenDropdown('none')}
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : -10,
          transition: {
            duration: 0.2,
            ease: "easeOut"
          }
        }}
      >
        {/* Bubble arrow pointing to the title */}
        <div className="absolute right-4 top-[-7px] w-3 h-3 bg-white transform rotate-45 border-t-1 border-l-1 border-gray-200 z-1"></div>
        
        {/* Menu Items */}
        <div className="relative py-1">
          <div 
            className="relative flex items-center px-4 py-2 cursor-pointer text-[13px] text-gray-800"
            onClick={() => {
              changeLanguage('vi');
              setOpenDropdown('none');
            }}
          >
            {/* Hover background effect */}
            <motion.div 
              className={cn(
                "absolute inset-0 backdrop-blur-sm",
                currentSelectedLang === 'vi' ? "bg-[rgba(233,233,233,0.4)]" : ""
              )}
              whileHover={{ 
                backgroundColor: "rgba(233, 233, 233, 0.4)",
              }}
              transition={{
                backgroundColor: { duration: 0.15 }
              }}
            />
            
            {/* Content (stays above the hover background) */}
            <div className="relative z-10 flex items-center w-full justify-between">             
                <span>Tiếng Việt</span>
              {currentSelectedLang === 'vi' && <Check className="w-3.5 h-3.5 text-green-500 ml-auto" />}
            </div>
          </div>
          
          <div 
            className="relative flex items-center px-4 py-2 cursor-pointer text-[13px] text-gray-800"
            onClick={() => {
              changeLanguage('en');
              setOpenDropdown('none');
            }}
          >
            {/* Hover background effect */}
            <motion.div 
              className={cn(
                "absolute inset-0 backdrop-blur-sm",
                currentSelectedLang === 'en' ? "bg-[rgba(233,233,233,0.4)]" : ""
              )}
              whileHover={{ 
                backgroundColor: "rgba(233, 233, 233, 0.4)",
              }}
              transition={{
                backgroundColor: { duration: 0.15 }
              }}
            />
            
            {/* Content (stays above the hover background) */}
            <div className="relative z-10 flex items-center w-full justify-between">
              <span>English</span>
              {currentSelectedLang === 'en' && <Check className="w-3.5 h-3.5 text-green-500 ml-auto" />}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}