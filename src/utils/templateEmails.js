export const templateEmailWelcomeUser = ({ user, companyData }) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bienvenido a  ${companyData.name}</title>
    <style type="text/css">
        /* Reset y estilos base */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f6f6f6;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: ${companyData.primaryColor};
            color: white;
            border-radius: 5px 5px 0 0;
        }
        
        .content {
            padding: 30px 20px;
        }
        
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: ${companyData.primaryColor};
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a ${companyData.name}!</h1>
        </div>
        
        <div class="content">
            <p>Hola ${user?.first_name} ${user?.last_name},</p>
            <p>Gracias por registrarte en nuestra plataforma. Ahora puedes disfrutar de:</p>
            
            <ul>
                <li>Acceso a tu carrito de compras personalizado</li>
                <li>Historial de pedidos</li>
                <li>Ofertas exclusivas</li>
                <li>Seguimiento de envíos</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="${companyData.loginUrl}" class="button">Comenzar a comprar</a>
            </p>
            
            <p>Tus datos de acceso:</p>
            <ul>
                <li><strong>Email:</strong> ${user?.email}</li>
                <li><strong>Teléfono:</strong> ${user?.phone ? user.phone : 'N/A'}</li>
            </ul>
            
            <p>Si tienes alguna duda, contáctanos respondiendo a este correo.</p>
        </div>
        
        <div class="footer">
            <p> ${companyData.name} · ${companyData.address}</p>
            <p>Teléfono:  ${companyData.phone} | Web: <a href=" ${companyData.website}"> ${companyData.website}</a></p>
            <p style="color: #999999;">Este es un correo automático, por favor no responder directamente.</p>
        </div>
    </div>
</body>
</html>`
}
