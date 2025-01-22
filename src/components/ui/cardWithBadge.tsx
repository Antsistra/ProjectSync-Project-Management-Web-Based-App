import React from "react";
import { Link } from "react-router-dom";

interface CardWithBadgeProps {
  title: string;
  icon: string;
  className: string;
  id: string;
}

export default function CardWithBadge({
  title,
  icon,
  className,
  id,
}: CardWithBadgeProps) {
  return (
    <>
      <Link to={`/project/${id}`}>
        <div className="card bg-base-100 shadow-xl h-80">
          <figure>
            <img src={icon} alt="Shoes" className="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-lg text-">{title}</h2>
            <div className="card-actions justify-start"></div>
          </div>
        </div>
      </Link>
    </>
  );
}
