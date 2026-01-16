import atracaoModel from "../../models/atracaoModel.js";

const listAll = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; 
    const skip = (page - 1) * limit;
    const filters = req.query;

    delete filters.page;
    delete filters.limit;
  
    const hasFilters = Object.keys(filters).length > 0;

    let result;

    if (hasFilters) {
      result = await atracaoModel.filterPaginated({
        filters,
        skip,
        take: limit,
      });
    } else {
      result = await atracaoModel.getAllPaginated({
        skip,
        take: limit,
      });
    }
    
    const { atracoes, total } = result;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: "Atrações listadas com sucesso!",
      data: atracoes,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Opsss erro no servidor, tente novamente!",
    });
  }
};

export default listAll;