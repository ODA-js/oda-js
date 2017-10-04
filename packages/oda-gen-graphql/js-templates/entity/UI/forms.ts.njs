<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<# chunkStart(`../../../UI/${entity.name}/title`); #>
import React from 'react';
const #{entity.name}Title = ({ record }) => {
  return <span>#{entity.name} {record ? `"${record.id}"` : ''}</span>;
};

export default #{entity.name}Title;
<# chunkStart(`../../../UI/${entity.name}/GridList`); #>
<# chunkStart(`../../../UI/${entity.name}/Filter`); #>

<# chunkStart(`../../../UI/${entity.name}/EditForm`); #>
<# chunkStart(`../../../UI/${entity.name}/ShowForm`); #>
//