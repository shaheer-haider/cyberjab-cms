import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import ClientPage from './client-page';

export const revalidate = 300;

export default async function TrackPage({
    params,
}: {
    params: Promise<{ urlSegments: string[] }>;
}) {
    const resolvedParams = await params;
    const filepath = resolvedParams.urlSegments.join('/');

    let data;
    try {
        data = await client.queries.track({
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
    let tracks = await client.queries.trackConnection();
    const allTracks = tracks;

    if (!allTracks.data.trackConnection.edges) {
        return [];
    }

    while (tracks.data?.trackConnection.pageInfo.hasNextPage) {
        tracks = await client.queries.trackConnection({
            after: tracks.data.trackConnection.pageInfo.endCursor,
        });

        if (!tracks.data.trackConnection.edges) {
            break;
        }

        allTracks.data.trackConnection.edges.push(...tracks.data.trackConnection.edges);
    }

    return (
        allTracks.data?.trackConnection.edges.map((edge) => ({
            urlSegments: edge?.node?._sys.breadcrumbs,
        })) || []
    );
}
