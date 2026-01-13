import { notFound } from 'next/navigation';
import client from '../../../tina/__generated__/client';
import Layout from '../../../components/layout/layout';
import ClientPage from './client-page';

export const revalidate = 300;

export default async function LabPage({
    params,
}: {
    params: Promise<{ urlSegments: string[] }>;
}) {
    const resolvedParams = await params;
    const filepath = resolvedParams.urlSegments.join('/');

    let data;
    try {
        data = await client.queries.lab({
            relativePath: `${filepath}.mdx`,
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
    let labs = await client.queries.labConnection();
    const allLabs = labs;

    if (!allLabs.data.labConnection.edges) {
        return [];
    }

    while (labs.data?.labConnection.pageInfo.hasNextPage) {
        labs = await client.queries.labConnection({
            after: labs.data.labConnection.pageInfo.endCursor,
        });

        if (!labs.data.labConnection.edges) {
            break;
        }

        allLabs.data.labConnection.edges.push(...labs.data.labConnection.edges);
    }

    return (
        allLabs.data?.labConnection.edges.map((edge) => ({
            urlSegments: edge?.node?._sys.breadcrumbs,
        })) || []
    );
}
