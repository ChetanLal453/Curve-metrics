import React from "react";

const ChooseTwo = () => {
  const cards = [
    {
      title: "You are the Priority",
      description:
        "The constantly expanding workforce will ensure the full capacity of the work ensuring the completion of your work regardless of the priority.",
      img: "https://digitalinfoways.com/wp-content/uploads/2021/01/you-are-the-priority.png",
    },
    {
      title: "Honesty and Hard Work",
      description:
        "We value honesty and hard work at Digital Infoways above everything else which has made us recognized as one of the loyal digital marketing agency in this industry.",
      img: "https://digitalinfoways.com/wp-content/uploads/2020/12/Experience.png",
    },
    {
      title: "Our Methods and Tactics",
      description:
        "The strategies of our digital marketing company are well tested in the market which will deliver a definite spike in your business.",
      img: "https://digitalinfoways.com/wp-content/uploads/2021/01/our-methods-and-tactics.png",
    },
    {
      title: "Cost-effective Project Management",
      description:
        "We employ a series of cost-effective tactics that will help you get a good ROI on your website.",
      img: "https://digitalinfoways.com/wp-content/uploads/2020/12/Cost.png",
    },
    {
      title: "Satisfied Client Base",
      description:
        "We have a rich client base that is happy with all the work that we are putting for their marketing efforts.",
      img: "https://digitalinfoways.com/wp-content/uploads/2020/12/Satisfied-Client.png",
    },
    {
      title: "Flexible Working Models",
      description:
        "We are flexible regarding our working model that can give us better results and new ways to execute our tactics.",
      img: "https://digitalinfoways.com/wp-content/uploads/2020/12/flexible.png",
    },
  ];

  return (
    <section id="our-work-sec" className="py-20 bg-white">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h6 className="text-blue-600 font-semibold">WHY CHOOSE US</h6>
          <h2 className="text-3xl font-bold uppercase mb-4 relative inline-block">
            WHY CHOOSE US
            <span className="block w-16 h-1 bg-blue-600 mx-auto mt-2"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here at Digital Infoways, we offer these six values to our clients
            which sets us apart from others.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="row row-cols-1 row-cols-md-2 gx-2 gy-4">
          {cards.map((card, index) => (
            <div key={index} className="col">
              <div
                className="card mb-3 shadow-lg border-0"
                style={{ maxWidth: "540px" }}
              >
                <div className="row g-0">
                  {/* Image */}
                  <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="img-fluid"
                      style={{ maxHeight: "80px", objectFit: "contain" }}
                    />
                  </div>
                  {/* Text */}
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title font-bold">{card.title}</h5>
                      <p className="card-text text-gray-600">
                        {card.description}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">Digital Infoways</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseTwo;
