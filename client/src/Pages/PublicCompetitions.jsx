import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { fetchPublicCompetitions } from "@/Redux/features/participationSlice";

function PublicCompetitions() {
  const dispatch = useDispatch();
  const { competitions, loading, error } = useSelector((state) => state.participation);

  useEffect(() => {
    dispatch(fetchPublicCompetitions());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-8 animate-fade-in">
          Upcoming Competitions
        </h1>

        {competitions?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg">No competitions available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {competitions?.map((competition, index) => (
              <div
                key={competition._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={competition.imageUrl || "https://via.placeholder.com/400x300"}
                        alt={competition.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg">
                        ${competition.registrationFee}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {competition.name}
                    </h2>
                    <p className="text-sm line-clamp-2 mb-4">
                      {competition.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span>📅 {new Date(competition.eventDate).toLocaleDateString()}</span>
                      <span>📍 {competition.venue}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Link to={`/public/competitions/${competition._id}`} className="w-full">
                      <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300">
                        View Details & Register
                      </button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicCompetitions;
