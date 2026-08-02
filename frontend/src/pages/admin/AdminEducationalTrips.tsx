import PackageTypeAdmin from "./PackageTypeAdmin"

function AdminEducationalTrips() {
  return (
    <PackageTypeAdmin
      type="education"
      pageTitle="Educational Trips"
      pageDescription="Manage educational/school trip packages shown on the public site."
      catalogLabel="Educational Trip Catalog"
      addButtonLabel="Add Educational Trip"
      singular="educational trip"
    />
  )
}

export default AdminEducationalTrips
