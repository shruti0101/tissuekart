import HeroVideo from "@/components/Landingpage/Hero";
import Collection from "@/components/Landingpage/Collection";
import Coupon from "@/components/Landingpage/Coupon"
import CategorySection from "@/components/Landingpage/Category";
import Whychoose from "@/components/Landingpage/Whychoose";



export default function Home() {
  return (
 <>
 <HeroVideo></HeroVideo>
 <Coupon></Coupon>
 {/* <Sliders></Sliders> */}
 <CategorySection></CategorySection>
 <Collection></Collection>
 <Whychoose></Whychoose>

 </>
  );
}
