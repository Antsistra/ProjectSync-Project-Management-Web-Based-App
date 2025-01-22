import CardWithBadge from "../ui/cardWithBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectCarousel() {
  const imgBaseUrl = import.meta.env.VITE_SUPABASE_IMG_BASE_URL;
  const { projects, loading, error } = useProjects();
  return (
    <>
      {projects.length > 0 ? (
        <Carousel className="w-3/4 mt-4">
          <CarouselContent className="-ml-1">
            {projects.map((project) => (
              <CarouselItem className="md:basis-1/2 " key={project.id}>
                <CardWithBadge
                  id={project.id}
                  title={project.title}
                  icon={`${imgBaseUrl}/${project.icon}`}
                  className="w-48"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="text-xl font-semibold mt-4">
          <p>No projects available</p>
        </div>
      )}
    </>
  );
}
