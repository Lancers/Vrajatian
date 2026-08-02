import PackageTypeAdmin from "./PackageTypeAdmin"

function AdminCorporateTrips() {
  return (
    <PackageTypeAdmin
      type="corporate"
      pageTitle="Corporate Trips"
      pageDescription="Manage corporate offsite/retreat packages shown on the public site."
      catalogLabel="Corporate Trip Catalog"
      addButtonLabel="Add Corporate Trip"
      singular="corporate trip"
    />
  )
}

export default AdminCorporateTrips
