
import { ApolloProvider } from "@apollo/client";
import { client } from "@/utils/apollo";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            {children}
        </section>
    )
}