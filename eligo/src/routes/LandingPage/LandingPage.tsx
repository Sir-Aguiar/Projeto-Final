import React from "react";
import styles from "./LandingPage.module.css";
import LandingCard from "../../components/LandingCard/LandingCard";
import cloud from "../../assets/LandingPage/cloud.png";
import support from "../../assets/LandingPage/support.png";
import student from "../../assets/LandingPage/student.png";
import NoLoginNavbar from "../../components/Navigation/NoLoginNavbar/NoLoginNavBar";
import Paragraph from "../../components/Paragraph/Paragraph";
import analytics from "../../assets/LandingPage/analytics-icon.svg";
import peace from "../../assets/LandingPage/peace.svg";
import launch from "../../assets/LandingPage/launch.jpeg";
import management from "../../assets/LandingPage/management.jpeg";
const LandingPage: React.FC = () => {
  return (
    <>
      <NoLoginNavbar />
      <div className={styles.content_container}>
        <div className={styles.apresentation_banner}>
          <div className={styles.banner}></div>
          <div className={styles.apresentation_message}>
            <h1 className={styles.apresentation_title}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at neque aliquam, sodales turpis id,
              porttitor eros.
            </h1>
            <div className={styles.invite}>
              <p className={styles.cta_invite}>Lorem ipsum dolor sit amet.</p>
              <div className={styles.CTAs}>
                <button className={styles.secundary}></button>
                <button className={styles.primary}></button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.promotions}>
          <LandingCard image={cloud} text="Lorem ipsum dolor sit et." />
          <LandingCard image={student} text="Lorem ipsum dolor sit et." />
          <LandingCard image={support} text="Lorem ipsum dolor sit et." />
        </div>

        <div className={styles.features}>
          <Paragraph
            direction="left"
            image={analytics}
            title="Lorem ipsum dolor sit in."
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar, orci at aliquet egestas, mauris augue molestie diam, a hendrerit nisi ligula pellentesque quam. "
          />
          <Paragraph
            direction="right"
            image={management}
            title="Lorem ipsum dolor sit in."
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar, orci at aliquet egestas, mauris augue molestie diam, a hendrerit nisi ligula pellentesque quam. "
          />
          <Paragraph
            direction="left"
            image={launch}
            title="Lorem ipsum dolor sit in."
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar, orci at aliquet egestas, mauris augue molestie diam, a hendrerit nisi ligula pellentesque quam. "
          />
          <Paragraph
            direction="right"
            image={peace}
            title="Lorem ipsum dolor sit in."
            paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar, orci at aliquet egestas, mauris augue molestie diam, a hendrerit nisi ligula pellentesque quam. "
          />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
