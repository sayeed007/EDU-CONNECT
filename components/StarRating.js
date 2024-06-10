import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ originalRating, ratingRange }) => {

    const rating = (originalRating > 5) ? (originalRating / 2) : originalRating;
    // IF Rating is count in 10

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={i} style={{ color: '#D97706', fontSize: '20px' }} />);
    }
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key={stars.length} style={{ color: '#D97706', fontSize: '20px' }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={stars.length} style={{ color: '#D97706', fontSize: '20px' }} />);
    }

    return (
        <div className='flex items-center gap-1'>
            {stars}
            ({originalRating} / {ratingRange})
        </div>
    );
};

export default StarRating;
