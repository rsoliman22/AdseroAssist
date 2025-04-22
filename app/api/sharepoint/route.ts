// This is a mock implementation of SharePoint integration
// In a real application, you would use Microsoft Graph API

export async function GET(req: Request) {
  const url = new URL(req.url)
  const type = url.searchParams.get("type")
  const query = url.searchParams.get("query") || ""

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (type === "documents") {
    return Response.json({
      documents: [
        {
          id: "doc1",
          name: "Legal Contract Template.docx",
          path: "/Documents/Legal/Templates/",
          modified: "2023-04-15T10:30:00Z",
          size: 245000,
        },
        {
          id: "doc2",
          name: "Client Agreement.pdf",
          path: "/Documents/Clients/",
          modified: "2023-04-10T14:20:00Z",
          size: 1200000,
        },
        {
          id: "doc3",
          name: "Compliance Guidelines.pdf",
          path: "/Documents/Compliance/",
          modified: "2023-03-22T09:15:00Z",
          size: 3400000,
        },
        {
          id: "doc4",
          name: "Case Study - Intellectual Property.docx",
          path: "/Documents/Case Studies/",
          modified: "2023-04-05T16:45:00Z",
          size: 520000,
        },
        {
          id: "doc5",
          name: "Legal Research Notes.docx",
          path: "/Documents/Research/",
          modified: "2023-04-18T11:10:00Z",
          size: 180000,
        },
      ].filter(
        (doc) =>
          doc.name.toLowerCase().includes(query.toLowerCase()) || doc.path.toLowerCase().includes(query.toLowerCase()),
      ),
    })
  }

  if (type === "reports") {
    return Response.json({
      reports: [
        {
          id: "rep1",
          name: "Monthly Activity Summary - March 2023",
          created: "2023-04-02T08:00:00Z",
          type: "monthly",
        },
        {
          id: "rep2",
          name: "Client Interaction Analysis Q1 2023",
          created: "2023-04-05T14:30:00Z",
          type: "quarterly",
        },
        {
          id: "rep3",
          name: "Document Usage Statistics",
          created: "2023-04-10T09:45:00Z",
          type: "analytics",
        },
      ].filter(
        (rep) =>
          rep.name.toLowerCase().includes(query.toLowerCase()) || rep.type.toLowerCase().includes(query.toLowerCase()),
      ),
    })
  }

  return Response.json({ error: "Invalid request type" }, { status: 400 })
}
