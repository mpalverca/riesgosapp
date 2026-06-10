import React, { PureComponent } from "react";

export default class NotFoud extends PureComponent {
  render() {
    return <div>
      <div 
      style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '2rem'
      }}
    >
      404 Not Found
      
    </div>;
<div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem' }}>
   Pagina en mantenimiento, por favor vuelva mas tarde
</div>

    </div>
  }
}
