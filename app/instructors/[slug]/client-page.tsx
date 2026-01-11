'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { InstructorQuery, InstructorQueryVariables } from '@/tina/__generated__/types';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import Image from 'next/image';

interface ClientPageProps {
    data: InstructorQuery;
    variables: InstructorQueryVariables;
    query: string;
}

export default function InstructorClientPage(props: ClientPageProps) {
    const { data } = useTina(props);
    const instructor = data.instructor;

    return (
        <Section>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {instructor.profileImage && (
                        <div className="w-48 h-48 relative rounded-full overflow-hidden shrink-0">
                            <Image
                                src={instructor.profileImage}
                                alt={`${instructor.firstName} ${instructor.lastName}`}
                                fill
                                className="object-cover"
                                data-tina-field={tinaField(instructor, 'profileImage')}
                            />
                        </div>
                    )}

                    <div className="flex-1">
                        <h1
                            className="text-4xl font-bold mb-2"
                            data-tina-field={tinaField(instructor, 'firstName')}
                        >
                            {instructor.firstName} {instructor.lastName}
                        </h1>

                        {instructor.yearsOfExperience && (
                            <p className="text-gray-600 mb-4" data-tina-field={tinaField(instructor, 'yearsOfExperience')}>
                                {instructor.yearsOfExperience} years of experience
                            </p>
                        )}

                        {instructor.bio && (
                            <div className="prose prose-lg mb-6" data-tina-field={tinaField(instructor, 'bio')}>
                                <TinaMarkdown content={instructor.bio} components={components} />
                            </div>
                        )}

                        {instructor.expertise && instructor.expertise.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Expertise</h2>
                                <div className="flex flex-wrap gap-2" data-tina-field={tinaField(instructor, 'expertise')}>
                                    {instructor.expertise.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {instructor.linkedinUrl && (
                                <a
                                    href={instructor.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    data-tina-field={tinaField(instructor, 'linkedinUrl')}
                                >
                                    LinkedIn
                                </a>
                            )}
                            {instructor.githubUrl && (
                                <a
                                    href={instructor.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-700 hover:text-gray-900"
                                    data-tina-field={tinaField(instructor, 'githubUrl')}
                                >
                                    GitHub
                                </a>
                            )}
                            {instructor.websiteUrl && (
                                <a
                                    href={instructor.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800"
                                    data-tina-field={tinaField(instructor, 'websiteUrl')}
                                >
                                    Website
                                </a>
                            )}
                        </div>

                        {instructor.email && (
                            <p className="mt-4 text-sm text-gray-600" data-tina-field={tinaField(instructor, 'email')}>
                                Contact: {instructor.email}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
}
