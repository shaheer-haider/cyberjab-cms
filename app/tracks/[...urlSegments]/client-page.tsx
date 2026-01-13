'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { TrackQuery, TrackQueryVariables } from '@/tina/__generated__/types';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import Link from 'next/link';

interface ClientPageProps {
    data: TrackQuery;
    variables: TrackQueryVariables;
    query: string;
}

export default function TrackClientPage(props: ClientPageProps) {
    const { data } = useTina(props);
    const track = data.track;

    return (
        <Section>
            <article className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4" data-tina-field={tinaField(track, 'name')}>
                        {track.name}
                    </h1>

                    {track.short_description && (
                        <p
                            className="text-xl text-gray-600 mb-6"
                            data-tina-field={tinaField(track, 'short_description')}
                        >
                            {track.short_description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                        {track.trackType && (
                            <span
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
                                data-tina-field={tinaField(track, 'trackType')}
                            >
                                {track.trackType}
                            </span>
                        )}
                        {track.difficulty && (
                            <span
                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full"
                                data-tina-field={tinaField(track, 'difficulty')}
                            >
                                {track.difficulty}
                            </span>
                        )}
                        {track.estimatedHours && (
                            <span
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                data-tina-field={tinaField(track, 'estimatedHours')}
                            >
                                {track.estimatedHours} hours
                            </span>
                        )}
                    </div>
                </div>

                {track.description && (
                    <div className="prose prose-lg max-w-none mb-12" data-tina-field={tinaField(track, 'description')}>
                        <div>{track.description}</div>
                    </div>
                )}

                {track.steps && track.steps.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Learning Path</h2>
                        <div className="space-y-4" data-tina-field={tinaField(track, 'steps')}>
                            {track.steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            {step?.order || index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{step?.name}</h3>
                                            {step?.description && (
                                                <p className="text-gray-600 mb-3">{step.description}</p>
                                            )}
                                            <div className="flex gap-2 text-sm">
                                                {step?.stepType && (
                                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                                        {step.stepType}
                                                    </span>
                                                )}
                                                {step?.isRequired && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                                                        Required
                                                    </span>
                                                )}
                                                {step?.isLocked && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                                        Locked
                                                    </span>
                                                )}
                                            </div>
                                            {step?.modules && (

                                                /* Modules are not directly linked from track steps in this implementation */
                                                step.modules.map((module, modIndex) => (
                                                    <div key={modIndex} className="mt-2">
                                                        {/* <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                                            Module: {module && module.module.name || 'Module'}
                                                        </span> */}
                                                        <Link
                                                            href={`/modules/${module?.module?._sys?.breadcrumbs?.join('/')}`}
                                                            className="inline-block mt-3 text-blue-600 hover:text-blue-800"
                                                        >
                                                            View {module && module.module.name} →
                                                        </Link>
                                                    </div>
                                                ))

                                            )}
                                            {step?.lab && (
                                                <Link
                                                    href={`/labs/${step.lab._sys?.breadcrumbs.join('/')}`}
                                                    className="inline-block mt-3 text-blue-600 hover:text-blue-800 ml-4"
                                                >
                                                    View Lab →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </Section>
    );
}
