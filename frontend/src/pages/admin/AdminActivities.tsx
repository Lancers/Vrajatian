import PackageTypeAdmin from "./PackageTypeAdmin"

function AdminActivities() {
  return (
    <PackageTypeAdmin
      type="activity"
      pageTitle="Activities"
      pageDescription="Manage bookable activities like paragliding, rafting, and more."
      catalogLabel="Activity Catalog"
      addButtonLabel="Add Activity"
      singular="activity"
    />
  )
}

export default AdminActivities
