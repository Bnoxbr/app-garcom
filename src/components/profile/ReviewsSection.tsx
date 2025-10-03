import React from 'react';

interface Review {
  id: string;
  author: string;
  author_photo: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'João da Silva',
    author_photo: 'https://i.pravatar.cc/40?u=1',
    rating: 5,
    comment: 'Excelente ambiente e organização impecável. Recomendo fortemente!',
    date: '20/04/2025',
  },
  {
    id: '2',
    author: 'Maria Oliveira',
    author_photo: 'https://i.pravatar.cc/40?u=2',
    rating: 4,
    comment: 'Ótima experiência, apenas um pequeno atraso no início do serviço.',
    date: '18/04/2025',
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <i 
                key={i} 
                className={`fas fa-star ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            ></i>
        );
    }
    return <div className="flex items-center">{stars}</div>;
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews = mockReviews }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
      <h3 className="font-semibold text-lg mb-4">Avaliações e Comentários</h3>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex items-start">
              <img src={review.author_photo} alt={review.author} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">{review.author}</h5>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-1">{review.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">Nenhuma avaliação recebida ainda.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;