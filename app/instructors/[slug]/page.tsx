import { notFound } from 'next/navigation';
import client from '../../../tina/__generated__/client';
import Layout from '../../../components/layout/layout';
import ClientPage from './client-page';

export const revalidate = 300;

export default async function InstructorPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;

    let data;
    try {
        data = await client.queries.instructor({
            relativePath: `${resolvedParams.slug}.md`,
        });
    } catch (error) {
        notFound();
    }

    return (
        <Layout rawPageData={data}>
            <ClientPage {...data} />
        </Layout>
    );
}

export async function generateStaticParams() {
    let instructors = await client.queries.instructorConnection();
    const allInstructors = instructors;

    if (!allInstructors.data.instructorConnection.edges) {
        return [];
    }

    while (instructors.data?.instructorConnection.pageInfo.hasNextPage) {
        instructors = await client.queries.instructorConnection({
            after: instructors.data.instructorConnection.pageInfo.endCursor,
        });

        if (!instructors.data.instructorConnection.edges) {
            break;
        }

        allInstructors.data.instructorConnection.edges.push(
            ...instructors.data.instructorConnection.edges
        );
    }

    return (
        allInstructors.data?.instructorConnection.edges.map((edge) => ({
            slug: edge?.node?._sys.filename.replace('.md', ''),
        })) || []
    );
}
