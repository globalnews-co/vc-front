export const querys = {

  getTipoOTS: `SELECT TOP (1000) [Tipo_ot] FROM [DevBD].[dbo].[Tipo_de_ot]`,
  getActivity: `SELECT TOP (1000) [Actividad] FROM [DevBD].[dbo].[Actividad]`,
  getFacturacion: `SELECT TOP (1000) [Facturacion] FROM [DevBD].[dbo].[Facturacion]`,
  getClients: `SELECT [NIT CLIENTE], [NOMBRE] FROM [DevBD].[dbo].[VC_View_Clientes]`,

  // 🔧 QUERY CORREGIDO PARA INSERTAR ORDEN DE TRABAJO
  insertOrder: `
    INSERT INTO [DevBD].[dbo].[VC_Ordenes_de_Trabajo] (
      [NIT CLIENTE],
      [FECHA OT],
      [NOMBRE CLIENTE],
      [NOMBRE ANUNCIANTE],
      [TIPO OT],
      [COBERTURA],
      [NACIONAL],
      [COBERTURA INTERNACIONAL],
      [DETALLE_COBERTURA_INTER],
      [Observaciones_Cobertura],
      [ALERTAS_CORREOS],
      [WHATSAPP],
      [NEWSLETERS_CORREOS],
      [PERSONA COMERCIAL],
      [PERSONA SERVICIO AL CLIENTE],
      [Observiaciones],
      [VALOR IMPRESOS],
      [VALOR RADIO],
      [VALOR TELEVISION],
      [VALOR INTERNET],
      [VALOR ANALISIS],
      [VALOR SOCIAL],
      [VALOR PACTADO],
      [VIGENCIA DESDE],
      [VIGENCIA HASTA],
      [Facturada], 
      [TOTAL CONTRATADO], 
      [NUMERO FACTURA], 
      [USUARIOS],
      [CORRECCION],
      [MARCA],
      [COMPETENCIAS],
      [ENTORNO],
      [SECTORES],
      [CATEGORIA],
      [SERVICIOS CONTRATADOS], 
      [ACTIVIDAD],
      [FACTURACION],
      [DETALLE_ANALISIS]
    ) 
    OUTPUT INSERTED.[orden de trabajo]
    VALUES (
      @NIT_Cliente,
      GETDATE(),
      @NombreCliente,
      @Nombre_Anunciante,
      @Tipo_Ot,
      @Cobertura,
      @NACIONAL,
      @COBERTURA_INTERNACIONAL,
      @DETALLE_COBERTURA_INTER,
      @Observaciones_Cobertura,
      @ALERTAS_CORREOS,
      @WHATSAPP,
      @NEWSLETERS_CORREOS,
      @Director_Comercial,
      @Servicio_Al_Cliente,
      @Comentarios_Detalle,
      @Valor_Impresos,
      @Valor_Radio,
      @Valor_Television,
      @Valor_Internet,
      @Valor_Analisis,
      @Valor_Social,
      @Total_Valor,
      @Vigencia_Desde,
      @Vigencia_Hasta,
      @Total_Dias,
      @Total_Valor_Dias, 
      @Numero_Ot, 
      @Usuarios,
      @Correccion,
      @Marca,
      @Competencias,
      @Entorno,
      @Sectores,
      @Categoria,
      @Servicios_Contratados, 
      @Actividad,
      @Facturacion,
      @Analisis
    );
  `,

  insertClient: `
    INSERT INTO [DevBD].[dbo].[Clientes] (
        [NOMBRE]
      ,[NIT CLIENTE]
      ,[DIRECCION]
      ,[TELEFONO]
      ,[EMAIL]
      ,[PERSONA DE CONTACTO]
      ,[OBSERVACIONES]
      ,PAGADOR
      ,[CIUDAD]
      ,[CUMPLEAÑOS]
      ,[TIPO]
      ,[FECHA CREACION CLIENTE]
    ) VALUES (
        @NombreCliente, 
        @Nit_Cliente, 
        @Direccion, 
        @Telefono, 
        @Correo_Electronico, 
        @Persona_de_Contacto, 
        @Detalle_Especiales, 
        @Pagador,
        @Ciudad,
        @Cumpleaños,
        @Tipo,
        GETDATE()
    )
  `,

  getOrdenT: `SELECT *
  FROM [DevBD].[dbo].[VC_Ordenes_de_Trabajo]
  WHERE [orden de trabajo] = @ordenid
  `,

  getClientByNIT: `
    SELECT TOP (1000) 
      [NombreCliente],
      [Cliente_ID],
      [Nit_Cliente],
      [FechaCreacionCliente],
      [Direccion],
      [Telefono],
      [Correo_Electronico],
      [Persona_de_Contacto],
      [Detalle_Especiales],
      [Celular],
      [Actividad],
      [Ciudad],
      [Cumpleaños],
      [Tipo],
      [Pagador]
    FROM [DevBD].[dbo].[Clientes]
    WHERE [Cliente_ID] = @NIT_Client
  `,

  queryLogin: `
 SELECT TOP (1000) [id]
      ,[username]
      ,[password]
      ,[nombre]
      ,[cargo]
  FROM [CalidadDB].[dbo].[Usuarios]
    WHERE [username] = @UserName
  `,

  createUser: `
    INSERT INTO [DevBD].[dbo].[VC_Usuarios] 
      ([username], [password]) 
    VALUES 
      (@username, @password)
  `,

  addRol: `
    INSERT INTO [DevBD].[dbo].[VC_UsuariosRoles] 
      ([user_id], [role_id]) 
    VALUES 
      (@UserID, @RoleID)
  `,

  querySelectRolesByuserID: `
    SELECT r.role_name, r.id
    FROM [DevBD].[dbo].[VC_UsuariosRoles] ur
    JOIN [DevBD].[dbo].[VC_Roles] r ON ur.role_id = r.id
    WHERE ur.user_id = @user_id
  `,

  getRolByID: `
    SELECT TOP (1) [role_name] 
    FROM [DevBD].[dbo].[VC_Roles]
    WHERE id = @RoleID
  `,

  getOrdenesForChecking: `
  SELECT  *
  FROM [DevBD].[dbo].[VC_View_OT] AS VC_VISTA
  WHERE [FIRMA COMERCIAL] IS NULL OR [FIRMA SERVICIO AL CLIENTE] IS NULL OR [FIRMA OPERACIONES] IS NULL
  order by [orden de trabajo] desc
  `,

  updateOrdenFirmaComercial: `
  UPDATE [dbo].[VC_Ordenes_de_Trabajo]
  SET [FIRMA COMERCIAL] = @firmaComercial
  WHERE [orden de trabajo] = @id
`,
  updateOrdenFirmaServicioCliente: `
  UPDATE [dbo].[VC_Ordenes_de_Trabajo]
  SET [FIRMA SERVICIO AL CLIENTE] = @firmaServicioCliente
  WHERE [orden de trabajo] = @id
`,
  updateOrdenFirmaOperaciones: `
  UPDATE [dbo].[VC_Ordenes_de_Trabajo]
  SET [FIRMA OPERACIONES] = @firmaOperaciones
  WHERE [orden de trabajo] = @id
`,

  getClientsView: `SELECT * FROM [DevBD].[dbo].[VC_View_Clientes]
  ORDER BY [FECHA CREACION CLIENTE] DESC`,
};