interface MethodBadgeProps {
  method: string;
}

const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  type ColorMap = {
    GET: string;
    POST: string;
    PATCH: string;
    PUT: string;
    DELETE: string;
    [key: string]: string;
  }

  // Mapeamento de cores para cada método HTTP
  const colorMap: ColorMap = {
    GET: '#3498db',
    POST: '#2ecc71',
    PATCH: '#f39c12',
    PUT: '#f39c12',
    DELETE: '#e74c3c'
  }

  // Cor padrão para métodos não mapeados
  const bgColor = colorMap[method] || '#95a5a6';

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: 'white',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
        minWidth: '60px',
        textAlign: 'center',
        marginRight: '8px'
      }}
    >
      {method}
    </span>
  );
}

export default MethodBadge;