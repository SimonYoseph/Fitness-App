import { LineChart } from "@/components/charts/line-chart";
import { ResourceWithContent } from "@/components/resource-with-content";

export function MeasurementsGraph({ data }) {
    
    if (!data || data.length === 0) {
        return null;
    }
    
    return (
        <ResourceWithContent
            scrolling={false}
        >
            <LineChart
                categories={[
                    "Weight",
                ]}
                className="h-80 mt-6"
                colors={[
                    "green",
                    "yellow",
                ]}
                data={data}
                index="date"
                yAxisWidth={40}
            />
        </ResourceWithContent>
    );
    
}