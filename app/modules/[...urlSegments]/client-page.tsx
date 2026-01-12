'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { ModuleQuery, ModuleQueryVariables } from '@/tina/__generated__/types';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import Image from 'next/image';
import Link from 'next/link';

interface ClientPageProps {
    data: ModuleQuery;
    variables: ModuleQueryVariables;
    query: string;
}

export default function ModuleClientPage(props: ClientPageProps) {
    const { data } = useTina(props);
    const module = data.module;

    return (
        <Section>
            <article className="max-w-4xl mx-auto">
                {module.photo && (
                    <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={module.photo}
                            alt={module.name || ''}
                            fill
                            className="object-cover"
                            data-tina-field={tinaField(module, 'photo')}
                        />
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4" data-tina-field={tinaField(module, 'name')}>
                        {module.name}
                    </h1>

                    {module.short_description && (
                        <p
                            className="text-xl text-gray-600 mb-6"
                            data-tina-field={tinaField(module, 'short_description')}
                        >
                            {module.short_description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {module.difficulty && (
                            <span
                                className="px-3 py-1 bg-gray-100 rounded-full"
                                data-tina-field={tinaField(module, 'difficulty')}
                            >
                                {module.difficulty}
                            </span>
                        )}
                        {module.durationHours && (
                            <span
                                className="px-3 py-1 bg-gray-100 rounded-full"
                                data-tina-field={tinaField(module, 'durationHours')}
                            >
                                {module.durationHours} hours
                            </span>
                        )}
                        {module.instructor && (
                            <Link
                                href={`/instructors/${module.instructor._sys?.filename.replace('.md', '')}`}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                                data-tina-field={tinaField(module, 'instructor')}
                            >
                                {module.instructor.firstName} {module.instructor.lastName}
                            </Link>
                        )}
                    </div>
                </div>

                {module.description && (
                    <div className="prose prose-lg max-w-none mb-8" data-tina-field={tinaField(module, 'description')}>
                        <TinaMarkdown content={module.description} components={components} />
                    </div>
                )}
            </article>
        </Section>
    );
}
