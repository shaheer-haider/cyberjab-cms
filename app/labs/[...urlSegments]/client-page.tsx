'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { LabQuery, LabQueryVariables } from '@/tina/__generated__/types';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import Link from 'next/link';
import Image from 'next/image';

interface ClientPageProps {
    data: LabQuery;
    variables: LabQueryVariables;
    query: string;
}

export default function LabClientPage(props: ClientPageProps) {
    const { data } = useTina(props);
    const lab = data.lab;

    return (
        <Section>
            <article className="max-w-4xl mx-auto">
                {lab.photo && (
                    <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={lab.photo}
                            alt={lab.name || ''}
                            fill
                            className="object-cover"
                            data-tina-field={tinaField(lab, 'photo')}
                        />
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4" data-tina-field={tinaField(lab, 'name')}>
                        {lab.name}
                    </h1>

                    {lab.short_description && (
                        <p
                            className="text-xl text-gray-600 mb-6"
                            data-tina-field={tinaField(lab, 'short_description')}
                        >
                            {lab.short_description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm mb-6">
                        {lab.labType && (
                            <span
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
                                data-tina-field={tinaField(lab, 'labType')}
                            >
                                {lab.labType === 'guided' ? 'Guided Lab' : 'CTF Challenge'}
                            </span>
                        )}
                        {lab.difficulty && (
                            <span
                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full"
                                data-tina-field={tinaField(lab, 'difficulty')}
                            >
                                {lab.difficulty}
                            </span>
                        )}
                        {lab.durationMinutes && (
                            <span
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                data-tina-field={tinaField(lab, 'durationMinutes')}
                            >
                                {lab.durationMinutes} minutes
                            </span>
                        )}
                        {lab.totalPoints && (
                            <span
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full"
                                data-tina-field={tinaField(lab, 'totalPoints')}
                            >
                                {lab.totalPoints} points
                            </span>
                        )}
                    </div>

                    {lab.skills && lab.skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Skills:</h3>
                            <div className="flex flex-wrap gap-2" data-tina-field={tinaField(lab, 'skills')}>
                                {lab.skills.map((skillItem, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                    >
                                        {skillItem?.skill?.name || 'Skill'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {lab.description && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Overview</h2>
                        <div className="prose prose-lg max-w-none" data-tina-field={tinaField(lab, 'description')}>
                            <div>{lab.description}</div>
                        </div>
                    </div>
                )}

                {lab.instructions && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                        <div className="prose prose-lg max-w-none" data-tina-field={tinaField(lab, 'instructions')}>
                            <TinaMarkdown content={lab.instructions} components={components} />
                        </div>
                    </div>
                )}

                {lab.flags && lab.flags.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Challenges</h2>
                        <div className="space-y-4" data-tina-field={tinaField(lab, 'flags')}>
                            {lab.flags.map((flag, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">
                                                {flag?.name || `Challenge ${index + 1}`}
                                            </h3>
                                            {flag?.description && (
                                                <p className="text-gray-600 mb-3">{flag.description}</p>
                                            )}
                                            {flag?.points && (
                                                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                                                    {flag.points} points
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {lab.lesson && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Related Lesson</h3>
                        <Link
                            href={`/lessons/${lab.lesson._sys?.breadcrumbs.join('/')}`}
                            className="text-blue-600 hover:text-blue-800"
                            data-tina-field={tinaField(lab, 'lesson')}
                        >
                            {lab.lesson.name} →
                        </Link>
                    </div>
                )}
            </article>
        </Section>
    );
}
