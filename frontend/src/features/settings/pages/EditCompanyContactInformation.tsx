import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import RouteList from "@/routes/RouteList";

export default function EditCompanyContactInformation() {
  return (
    <>
        <HeaderPageBackFeature 
            headerTitle="Contact Information"
            to={RouteList.settings}
            buttonTitle="Back to Settings"
        />
    </>
  )
}
