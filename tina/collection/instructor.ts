import type { Collection } from 'tinacms';
// import client from '../__generated__/client';

const Instructor: Collection = {
    label: 'Instructors',
    name: 'instructor',
    path: 'content/instructors',
    format: 'md',
    ui: {
        router: ({ document }) => {
            return `/instructors/${document._sys.filename}`;
        },
    },
    fields: [
        {
            type: 'string',
            label: 'First Name',
            name: 'firstName',
            required: true,
        },
        {
            type: 'string',
            label: 'Last Name',
            name: 'lastName',
            required: true,
        },
        {
            type: 'string',
            label: 'Email',
            name: 'email',
        },
        {
            type: 'string',
            label: 'Phone',
            name: 'phone',
        },
        {
            type: 'rich-text',
            label: 'Bio',
            name: 'bio',
            description: 'Instructor biography and background',
        },
        {
            type: 'string',
            label: 'Expertise',
            name: 'expertise',
            list: true,
            description: 'Areas of expertise (e.g., Azure Security, Threat Hunting)',
            ui: {
                component: 'tags',
            },
        },
        {
            type: 'number',
            label: 'Years of Experience',
            name: 'yearsOfExperience',
            description: 'Years of professional experience',
        },
        {
            type: 'image',
            label: 'Profile Image',
            name: 'profileImage',
            // @ts-ignore
            uploadDir: () => 'instructors',
        },
        {
            type: 'string',
            label: 'LinkedIn URL',
            name: 'linkedinUrl',
        },
        {
            type: 'string',
            label: 'GitHub URL',
            name: 'githubUrl',
        },
        {
            type: 'string',
            label: 'Website URL',
            name: 'websiteUrl',
        },
        {
            type: 'boolean',
            label: 'Active',
            name: 'isActive',
            description: 'Is this instructor currently active?',
            ui: {
                component: 'toggle',
            },
        },
        {
            type: 'string',
            label: 'Slug',
            name: 'slug',
            required: true,
            isTitle: true,
            nameOverride: 'slug',
            description: 'URL-friendly identifier (e.g., john-doe)',
        },
    ],
};

export default Instructor;
