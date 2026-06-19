'use client';

import { useState } from 'react';
import { CourseCurriculumProps } from '@/types/course';
import CurriculumItemRow from './CurriculumItemRow';
import Card from '@/components/ui/Card';

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ sections }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.slice(0, 1).map((s) => s._id))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const totalItems = sections.reduce((sum, section) => sum + (section.items?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
        <p className="text-gray-600">
          {sections.length} section{sections.length !== 1 ? 's' : ''} • {totalItems} lesson
          {totalItems !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, sectionIndex) => (
          <Card key={section._id} className="overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section._id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <span className="text-2xl">
                  {expandedSections.has(section._id) ? '▼' : '▶'}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {section.items?.length || 0} lesson{section.items?.length !== 1 ? 's' : ''}
              </div>
            </button>

            {/* Section Items */}
            {expandedSections.has(section._id) && section.items && section.items.length > 0 && (
              <div className="border-t bg-gray-50">
                {section.items.map((item, itemIndex) => (
                  <CurriculumItemRow
                    key={item._id}
                    item={item}
                    sectionIndex={sectionIndex}
                    itemIndex={itemIndex}
                  />
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;
