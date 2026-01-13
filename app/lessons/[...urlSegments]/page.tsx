import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import ClientPage from './client-page';

export const revalidate = 300;

export default async function LessonPage({
    params,
}: {
    params: Promise<{ urlSegments: string[] }>;
}) {
    const resolvedParams = await params;
    const filepath = resolvedParams.urlSegments.join('/');

    let data;
    try {
        data = await client.queries.lesson({
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
    let lessons = await client.queries.lessonConnection();
    const allLessons = lessons;

    if (!allLessons.data.lessonConnection.edges) {
        return [];
    }

    while (lessons.data?.lessonConnection.pageInfo.hasNextPage) {
        lessons = await client.queries.lessonConnection({
            after: lessons.data.lessonConnection.pageInfo.endCursor,
        });

        if (!lessons.data.lessonConnection.edges) {
            break;
        }

        allLessons.data.lessonConnection.edges.push(...lessons.data.lessonConnection.edges);
    }

    return (
        allLessons.data?.lessonConnection.edges.map((edge) => ({
            urlSegments: edge?.node?._sys.breadcrumbs,
        })) || []
    );
}
