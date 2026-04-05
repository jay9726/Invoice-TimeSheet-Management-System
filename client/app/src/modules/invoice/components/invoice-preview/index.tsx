import React from "react";

export type InvoicePreviewResponse = {
  company: {
    companyId: string;
    companyName: string;
    companyLogo: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billTo: {
    clientId: string;
    clientName: string;
    contactNumber: string;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  bankDetails: {
    bankDetailId: string;
    bankName: string;
    swiftCode: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
  };
  projects: Array<{
    projectId: string;
    projectName: string;
    totalHours: number;
    rate: number;
    fromDate: string;
    toDate: string;
    amount: number;
  }>;
  totalAmount: number;
  invoiceNumber: string,
  poNumber: string
};

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const formatDate = (iso: string) => {
  if (!iso || iso.startsWith("0001-01-01")) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
};


export const InvoicePreviewA4 = React.forwardRef<HTMLDivElement, { data: InvoicePreviewResponse }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "210mm",
          minHeight: "auto",
          padding: "50px",
          fontFamily: "Arial, sans-serif",
          color: "#111",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          backgroundColor: "#ffffff",
        }}
      >

        {/* Header */}
        <div style={{ display: "flex",  justifyContent: "space-between", marginBottom: "40px" }}>

          <img
            crossOrigin="anonymous"
            src={`https://localhost:7273/${data.company.companyLogo.replace(/^\/+/, '')}?t=${Date.now()}`}
            alt="logo"
            style={{ width: "120px", objectFit: "contain" }}
          />

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "40px", letterSpacing: "4px" }}>INVOICE</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <div style={{ marginTop: "14px", fontSize: "14px" }}>INVOICE NO:</div>
              <div style={{ marginTop: "14px", fontSize: "14px" }}>#{data.invoiceNumber}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <div style={{ marginTop: "3px", fontSize: "14px" }}>PO NO:</div>
              <div style={{ marginTop: "3px", fontSize: "14px" }}>#{data.poNumber}</div>
            </div>
          </div>
        </div>


        {/* Address Section */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "70px" }}>

          <div style={{ width: "45%" }}>
            <div style={{ fontWeight: "bold", letterSpacing: "1px", marginBottom: "8px" }}>
              BILLED TO:
            </div>
            {/* Bank */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", rowGap: "6px" }}>
                <div>Client</div>
                <div>{data.billTo.clientName}</div>

                <div>Address</div>
                <div>{data.billTo.addressLine1}</div>

                <div>Location</div>
                <div>{data.billTo.city}, {data.billTo.state}</div>

                <div>Country</div>
                <div>{data.billTo.country}</div>

                <div>Zip</div>
                <div>{data.billTo.zip}</div>
              </div>
            </div>

          </div>


          <div style={{ width: "45%" }}>
            <div style={{ fontWeight: "bold", letterSpacing: "1px", marginBottom: "8px" }}>
              PAY TO:
            </div>

            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", rowGap: "6px" }}>
                <div>Company</div>
                <div>{data.company.companyName}</div>

                <div>Address</div>
                <div>{data.company.addressLine1}</div>

                <div>Location</div>
                <div>{data.company.city}, {data.company.state}</div>

                <div>Country</div>
                <div>{data.company.country}</div>

                <div>Zip</div>
                <div>{data.company.zip}</div>
              </div>
            </div>

          </div>
        </div>




        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "50px",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #888" }}>
              <th style={{ textAlign: "left", padding: "10px" }}>PROJECTS</th>
              <th style={{ textAlign: "left", padding: "10px" }}>FROM DATE</th>
              <th style={{ textAlign: "left", padding: "10px" }}>TO DATE</th>
              <th style={{ textAlign: "left", padding: "10px" }}>HOURS</th>
              <th style={{ textAlign: "left", padding: "10px" }}>RATE</th>
              <th style={{ textAlign: "left", padding: "10px" }}>AMOUNT</th>
            </tr>
          </thead>

          <tbody>
            {data.projects.map((p) => (
              <tr key={p.projectId} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "10px" }}>{p.projectName}</td>
                <td style={{ padding: "10px" }}>{formatDate(p.fromDate)}</td>
                <td style={{ padding: "10px" }}>{formatDate(p.toDate)}</td>
                <td style={{ padding: "10px" }}>{p.totalHours}</td>
                <td style={{ padding: "10px" }}>{money(p.rate)}</td>
                <td style={{ padding: "10px" }}>{money(p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>


        {/* Total */}
        <div style={{ textAlign: "right", fontSize: "18px", fontWeight: "bold" }}>
          TOTAL&nbsp;&nbsp; {money(data.totalAmount)}
        </div>

        {/* Bank */}
        <div style={{ marginTop: "70px" }}>
          <div style={{ fontWeight: "bold", letterSpacing: "1px", marginBottom: "8px" }}>
            BANK DETAILS:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", rowGap: "6px" }}>
            <div>Bank</div>
            <div>{data.bankDetails.bankName}</div>

            <div>Account Name</div>
            <div>{data.bankDetails.accountName}</div>

            <div>Account No.</div>
            <div>{data.bankDetails.accountNumber}</div>

            <div>Swift Code</div>
            <div>{data.bankDetails.swiftCode}</div>

            <div>Routing No.</div>
            <div>{data.bankDetails.routingNumber}</div>
          </div>
        </div>


        {/* Footer */}
        <div style={{ marginTop: "70px", fontSize: "15px", color: "#555", display: "flex", justifyContent: "center" }}>
          Payment is required within 14 business days of invoice date.
        </div>

      </div>
    );
  }
);

InvoicePreviewA4.displayName = "InvoicePreviewA4";